import { createStore, applyMiddleware } from 'redux';

const INCREMENT = '@action/increment';
const DECREMENT = '@action/decrement';
const RESET = '@action/reset';

// 초기 상태
const initState = {
	count: 0,
	message: '안녕하세요!!!!',
};

// Reducer
function reducer(state = initState, action) {
	switch (action.type) {
		case INCREMENT:
			return {
				...state,
				count: state.count + 1,
				message: action.payload,
			};
		case DECREMENT:
			return {
				...state,
				count: state.count - 1,
				message: action.message,
			};
		case RESET:
			return {
				...state,
				count: 0,
				message: action.message ? action.message : '',
			};
		default:
			return state;
	}
}

const beholder = (store) => (next) => (action) => {
	setTimeout(() => {
		if (action.type === RESET) {
			next({
				type: RESET,
				message: '이제 아무것도 안하는건가요?',
			});
		}
	}, 1000);

	return next(action);
};

const render = function (state) {
	const { count, message } = state;

	document.querySelector('.count').innerHTML = `<h1>${count}</h1>`;
	document.querySelector('.message').innerHTML = `<h1>${message}${count === 0 ? '빨리 뭐라도 해볼까요?' : ''}</h1>`;
};

// Store
const store = createStore(reducer, applyMiddleware(beholder));

// Subscribe
store.subscribe(() => render(store.getState()));

const init = function () {
	render(initState);

	document.querySelector('.increment-btn').addEventListener('click', function () {
		store.dispatch({
			type: INCREMENT,
			payload: '증가하겠습니다',
		});
	});

	document.querySelector('.decrement-btn').addEventListener('click', function () {
		store.dispatch({
			type: DECREMENT,
			message: '감소하겠습니다',
		});
	});

	document.querySelector('.reset-btn').addEventListener('click', function () {
		store.dispatch({
			type: RESET,
		});
	});
};

window.onload = function () {
	init();
};
