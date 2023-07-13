import {Link, Navigate, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

export const ExistingUser = () => {
	const emailRef = useRef(null)
	const passwordRef = useRef(null)
	const navigate = useNavigate()
	return (
		<div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white">
			<div className="w-1/3 h-2/5 bg-zinc-900 rounded-xl shadow-xl hover:shadow-2xl transition duration-300">
				<form className="h-full w-full rounded-xl p-4 pt-0 grid grid-rows-[30%_25%_25%_20%]">
					<div className="flex items-center font-bold justify-center text-4xl">Meet + <Link
						className="font-light w-4/6 flex justify-end text-sm hover:underline" to="/Signup">Not an
						Existing User? Signup</Link></div>
					<input ref={emailRef} required placeholder="Enter email" className=" p-3 text-2xl font-semibold focus:outline-none bg-zinc-800 mb-2 rounded-lg" type="email"/>
					<input ref={passwordRef} required placeholder="Enter password" className=" p-3 text-2xl font-semibold focus:outline-none bg-zinc-800 mb-2 rounded-lg" type="password"/>
					<button className="bg-slate-900 hover:bg-slate-800 font-bold text-2xl rounded-lg" type="submit"
							onClick={(e) => {
								e.preventDefault();
								fetch("http://localhost:3000/auth/signin", {
									method: "POST",
									headers: {
										"Content-type": "application/json"
									},
									body: JSON.stringify({
										email: emailRef.current.value,
										password: passwordRef.current.value
									})
								}).then(response => response.json())
									.then((resp) => {
											localStorage.setItem("token", resp.token)
											navigate("/Home");
										}
									).catch((err) => console.log(err))
							}
							}>Submit
					</button>
				</form>
			</div>
		</div>
	)
}