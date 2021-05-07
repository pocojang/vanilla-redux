import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';

const INCREMENT = '@action/increment';
const DECREMENT = '@action/decrement';
const RESET = '@action/reset';

// 초기 상태
const initState = {
	count: 0,
	message: '안녕하세요!!!!',
	imgUrl: '',
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
		case 'GET_DOG_SUCCESS':
			return {
				...state,
				imgUrl: action.payload,
			};
		case 'GET_DOG_ERROR':
			return {
				...state,
				imgUrl: null,
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
	const { count, message, imgUrl } = state;

	document.querySelector('.count').innerHTML = `<h1>${count}</h1>`;
	document.querySelector('.message').innerHTML = `<h1>${message}${count === 0 ? '빨리 뭐라도 해볼까요?' : ''}</h1>`;
	document.querySelector('.dog-album').innerHTML = `<img src="${imgUrl}">`;
};

// Store
const store = createStore(reducer, composeWithDevTools(applyMiddleware(ReduxThunk, beholder)));

// Subscribe
store.subscribe(() => {
	const currentState = store.getState();

	render(currentState);
});

const init = function () {
	render(initState);

	document.querySelector('.increment-btn').addEventListener('click', function () {
		store.dispatch({
			type: INCREMENT,
			payload: '증가하겠습니다',
		});

		fetch('https://dog.ceo/api/breeds/image/random/' + store.getState().count)
			.then((response) => response.json())
			.then(({ message, status }) => {
				const [firstDogImageUrl] = message;

				store.dispatch({ type: 'GET_DOG_SUCCESS', payload: firstDogImageUrl });
			})
			.catch((e) => store.dispatch({ type: 'GET_DOG_ERROR', error: e }));
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
