import { createStore } from './src/index';

// 定义一个reducer
const reducer =  (state = 0, action) => {
  console.log(action.type);
  switch(action.type) {
    case 'ADD_ONE':
      return state + 1;
    case 'MINUS_ONE':
      return state - 1;
    default:
      return state;
  }
};

// 创建一个store实例
const store = createStore(reducer);

// DOM缓存
const $count = document.querySelector('.count');
const $addBtn = document.querySelector('.add');
const $minusBtn = document.querySelector('.minus');

$addBtn.onclick = () => {
  store.dispatch({
    type: 'ADD_ONE'
  });
}

$minusBtn.onclick =() => {
  console.log(
  store.dispatch({
    type: 'MINUS_ONE'
  })
  )
}

store.subscribe(() => {
  console.log(666);
  $count.innerText = store.getState();
})

