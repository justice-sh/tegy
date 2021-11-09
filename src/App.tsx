import { useEffect } from "react";
import "./App.css";
import { stateLoaded } from "./model/budgetSlice";
import { useAppDispatch } from "./model/hooks";
import { ModalE, toggledModal } from "./model/uiSlice";
import Loader from "./components/common/loader";
import CreateBatch from "./components/modal/createBatch";
import Login from "./components/modal/login";
import SignUp from "./components/modal/signUp";
import Tracker from "./components/tracker";
import { onStateChange } from "./services/authService";
import { getAppFromDB as loadAppFromDB } from "./services/budgetService";
import CreateBudget from "./components/modal/createBudget";

function App() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		onStateChange(user => {
			if (user) {
				dispatch(() => {
					loadAppFromDB(user, budgets => dispatch(stateLoaded(budgets)));
				});
			} else {
				dispatch(toggledModal(ModalE.LOGIN));
			}
		});
	}, [dispatch]);

	return (
		<div className="App">
			<Loader />

			{/* Modals */}
			<Login />
			<SignUp />
			<CreateBatch />
			<CreateBudget />

			{/* Page */}
			<Tracker />
		</div>
	);
}

export default App;
