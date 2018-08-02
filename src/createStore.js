import isPlainObject from './utils/isPlainObject';

export default function createStore(reducer, preloadedState) {
  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }

  let currentState = preloadedState // state
  let listeners = [] // 订阅事件列表
  let isDispatching = false // 是否正在执行reducer

  function getState() {
    // 如果正在执行reducer，则抛出异常
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ')
    }
    return currentState;
  }

  // 添加订阅事件
  function subscribe(listener) {
    if(typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.')
    }

    let isSubscribed = true;
    listeners.push(listener);

    // 返回一个取消订阅事件的函数
    return function unsubscribe() {
      if(!isSubscribed) {
        return;
      }

      if(isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ');
      }

      isSubscribed = false;

      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    }
  }

  function dispatch(action) {
    // 如果action不是原生对象，则抛出异常
    // 因为我们期待的action结构为"{type: 'xxx', payload: 'xxx'}"的原生对象
    // 注意，异步action除外 ，我们后面再讨论用中间件处理
    if(!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ');
    }

    if(typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ')
    }

    if(isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    // 开始调用reducer获取新状态。因为可能会出错需要用try-catch
    // 并且不管成功失败，执行完毕后都要设置isDispatching=true
    try {
      isDispatching = true;
      currentState = reducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    // 遍历所有通过store.subscribe()绑定的的订阅事件，并调用他们
    listeners.forEach((listener) => {
      listener();
    })

    return action;
  }

  // 将getState, subscribe, dispatch这三个方法暴露出去
  // 创建了store实例之后，可以store.getState()、store.subscripbe()...
  return {
    getState,
    subscribe,
    dispatch
  }
}