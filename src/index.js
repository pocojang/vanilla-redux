import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

/**
 * @see {@link redux-thunk}
 * @see {@link https://github.com/reduxjs/redux-thunk/blob/master/src/index.ts}
 */
function createThunkMiddleware(extraArgument) {
	return function ({ dispatch, getState }) {
		return function (next) {
			return function (action) {
				if (typeof action === 'function') {
					// getDog()
					return action(dispatch, getState, extraArgument);
				}

				// { type: INCREMENT, payload: '증가하겠습니다' }
				return next(action);
			};
		};
	};
}

const ReduxThunk = createThunkMiddleware();

// 초기 상태
const initState = {
	count: 0,
	message: '안녕하세요!!!!',
	imgUrl: '',
};

// Action Type
const INCREMENT = '@action/increment';
const DECREMENT = '@action/decrement';
const RESET = '@action/reset';

// Action
const increment = {
	type: INCREMENT,
	payload: '증가하겠습니다',
};

const decrement = {
	type: DECREMENT,
	message: '감소하겠습니다',
};

const reset = {
	type: RESET,
};

const getDog = () => (dispatch, getState, extraArgument) => {
	fetch('https://dog.ceo/api/breeds/image/random/' + getState().count)
		.then((response) => response.json())
		.then(({ message, status }) => {
			const [firstDogImageUrl] = message;

			dispatch({ type: 'GET_DOG_SUCCESS', payload: firstDogImageUrl });
		})
		.catch((e) => dispatch({ type: 'GET_DOG_ERROR', error: e }));
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
			return next({
				type: RESET,
				message: '왜 안되는걸까요???',
			});
		}
	}, 1000);

	return next(action);
};

const lokbaSeven = (store) => (next) => (action) => {
	if (action.type === INCREMENT) {
		return next({
			type: INCREMENT,
			message: '록바의 자신감은 우주와 같이 상승하고 있다.',
		});
	}

	return next(action);
};

const render = function (state) {
	const { count, message, imgUrl } = state;

	document.querySelector('.count').innerHTML = `<h1>${count}</h1>`;
	document.querySelector('.message').innerHTML = `<h1>${message}${
		count === 0 ? '빨리 뭐라도 해볼까요?' : ''
	}</h1>`;
	document.querySelector(
		'.dog-album',
	).innerHTML = `<img src="${imgUrl}" style="max-height: 500px;">`;
};

// Store
const store = createStore(
	reducer,
	composeWithDevTools(applyMiddleware(ReduxThunk, beholder)),
);

// Subscribe
store.subscribe(() => {
	const currentState = store.getState();

	render(currentState);
});

const init = function () {
	render(initState);

	document
		.querySelector('.increment-btn')
		.addEventListener('click', function () {
			// dispatch에게 순수한걸 넘기고 있다.
			store.dispatch({ type: INCREMENT, payload: '증가하겠습니다' });
			// dispatch에 순수하지 않은 함수를 넘기고 있다.
			store.dispatch(getDog());
		});

	document
		.querySelector('.decrement-btn')
		.addEventListener('click', function () {
			store.dispatch(decrement);
			store.dispatch(getDog());
		});

	document.querySelector('.reset-btn').addEventListener('click', function () {
		store.dispatch(reset);
	});
};

window.onload = function () {
	init();
};
