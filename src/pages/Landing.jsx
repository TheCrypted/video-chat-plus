import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export const Landing = () => {
	const navigate = useNavigate()
	const [user,setUser] = useState({})
	const [displayDropdown, setDisplayDropdown] = useState(false)
	const [displayText, setDisplayText] = useState("Welcome to meeting +")
	const [textChanging, setTextChanging] = useState(false)
	const reloadSpeed = 200;
	const displayTextOrig = "Welcome to meeting +"

	useEffect(()=>{
		const token = localStorage.getItem("token")
		fetch("http://localhost:3000/auth/protected", {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				auth: token
			}
		}).then(response => response.json())
			.then(resp => setUser(resp.user))
			.catch(err => console.log(err))
	})
	const signOutClick = () => {
		localStorage.removeItem("token")
		window.location.reload()
	}
	const displayTextChange = () => {
		let newText = displayText.split("")
		let i = 0
		const textChangeInt = setInterval(() => {
			for (let letter = 0; letter < displayText.length; letter++) {
				if(letter < i){
					newText[letter] = displayTextOrig.charAt(letter)
				} else {
					const charCode = Math.floor(Math.random() * (127 - 65) + 65)
					newText[letter] = String.fromCharCode(charCode)
				}
				setDisplayText(newText.join(""))
			}
			if (i > displayText.length){
				clearInterval(textChangeInt)
			}
			i++
		}, 40)
	}
	return (
		<div className="w-full h-full bg-zinc-800 grid grid-rows-[8%_92%] text-white">
			<div className="bg-black w-full h-full flex">
				<div className="flex items-center justify-start w-[91.5%] text-2xl font-semibold pl-3">Welcome {user.name}</div>
				<div className="flex items-center justify-end w-[8.5%] text-2xl font-semibold pr-4 hover:bg-zinc-900 hover:cursor-pointer" onMouseLeave={()=>setDisplayDropdown(false)} onMouseEnter={()=>setDisplayDropdown(true)}>My Profile</div>
				{ displayDropdown && <div onMouseLeave={()=>setDisplayDropdown(false)} onMouseEnter={()=>setDisplayDropdown(true)} className="absolute rounded-bl-xl h-2/6 w-[8.5%] bg-black right-0 top-16 grid-rows-3 grid">
					<div className="flex items-center text-xl  pr-4 hover:bg-zinc-900 hover:cursor-pointer p-4 text-gray-300">My Profile</div>
					<div className="flex items-center text-xl  pr-4 hover:bg-zinc-900 hover:cursor-pointer p-4 text-gray-300">Meeting + </div>
					<div className="flex items-center text-xl  pr-4 hover:bg-zinc-900 hover:cursor-pointer p-4 text-gray-300 rounded-bl-xl" onClick={signOutClick}>Sign Out</div>
				</div>}
			</div>
			<div className="">
				<div className="h-auto p-5 inline-block bg-zinc-950 w-auto relative top-24 text-9xl font-bold hover:cursor-pointer rounded-r-2xl" onMouseEnter={displayTextChange}>{displayText}</div>
			</div>
		</div>
	)
}