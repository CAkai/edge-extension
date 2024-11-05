import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './popup';
import { Provider } from 'react-redux';
import userStore from '../store/user.store';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={userStore}>
            <Popup />
        </Provider>
    </StrictMode>,
);
