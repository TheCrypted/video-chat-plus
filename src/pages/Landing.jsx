import {useNavigate} from "react-router-dom";

export const Landing = () => {
	const navigate = useNavigate()
	return (
		<div className="w-full h-full bg-zinc-800 grid grid-rows-[8%_92%] text-white">
			<div className="bg-black w-full h-full flex">
				<div className="flex items-center justify-start w-[95%] text-2xl font-semibold pl-3">Welcome Aman</div>
				<div className="flex items-center justify-end w-[6%] text-2xl font-semibold pr-4 hover:bg-zinc-900 hover:cursor-pointer" onClick={()=>navigate("/Signin")}>Login</div>
			</div>
			<div className=""></div>
		</div>
	)
}