import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

export const useCurrentUser = () => useAppSelector((state) => state.auth.user);
export const useAuthToken = () => useAppSelector((state) => state.auth.accessToken);
export const useNotifications = () => useAppSelector((state) => state.notifications.items);
