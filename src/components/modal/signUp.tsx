import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../model/hooks";
import { ModalE, selectModal, toggledModal } from "../../model/uiSlice";
import Button from "../common/button";
import Input from "../common/input";
import { LoginRegister, ModalWrapper, Cancel } from "./base";
import authService from "../../services/authService";
import { toast } from "react-toastify";

function SignUp() {
	const dispatch = useAppDispatch();
	const showModal = useAppSelector(selectModal(ModalE.SIGN_UP));

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	if (!showModal) return null;

	const handleSubmit = () => {
		try {
			if (!email || !password) throw Error("Empty fields not allowed.");

			dispatch(async () => {
				await authService.signUp(email, password);

				dispatch(toggledModal(ModalE.SIGN_UP));

				toast.success("Accounted created successfully.");
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<ModalWrapper theme={window.theme} title="register">
			<Input
				placeholder="email"
				value={email}
				onChange={e => setEmail(e.target.value)}
				type="email"
			/>
			<Input
				placeholder="password"
				value={password}
				onChange={e => setPassword(e.target.value)}
				type="password"
			/>

			<div>
				<Button onClick={handleSubmit} color={window.theme.primary}>
					okay
				</Button>
				<Cancel modal={ModalE.SIGN_UP} />
			</div>

			<LoginRegister onClick={() => dispatch(toggledModal(ModalE.LOGIN))}>
				Already have account? SIGN-IN
			</LoginRegister>
		</ModalWrapper>
	);
}

export default SignUp;
