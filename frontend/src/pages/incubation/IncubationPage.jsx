import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { ROLES } from "../../constants/roles";

import MyIdeasPage from "./MyIdeasPage";
import CoordinatorIdeasPage from "./CoordinatorIdeasPage";
import DeanIdeasPage from "./DeanIdeasPage";

export default function IncubationPage() {
  const user = useSelector(selectCurrentUser);

  if (user?.role === ROLES.CAMPUS_COORDINATOR) {
    return <CoordinatorIdeasPage />;
  }

  if (user?.role === ROLES.DEAN_EITP) {
    return <DeanIdeasPage />;
  }

  return <MyIdeasPage />;
}