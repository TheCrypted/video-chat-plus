import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

export const Landing = () => {
	const navigate = useNavigate()
	const [user,setUser] = useState({})
	const [displayDropdown, setDisplayDropdown] = useState(false)
	const [displayText, setDisplayText] = useState("Welcome to meeting +")
	const [mouseIn, setMouseIn] = useState(false)
	const meetingIdRef = useRef(null)
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
	}, [])
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
			<div className="bg-black w-full h-full flex z-10">
				<div className="flex items-center justify-start w-[91.5%] text-2xl font-semibold pl-3">Welcome {user.name}</div>
				<div className="flex items-center justify-end w-[8.5%] text-2xl font-semibold pr-4 hover:bg-zinc-900 hover:cursor-pointer" onMouseLeave={()=>setDisplayDropdown(false)} onMouseEnter={()=>setDisplayDropdown(true)}>My Profile</div>
				{ displayDropdown && <div onMouseLeave={()=>setDisplayDropdown(false)} onMouseEnter={()=>setDisplayDropdown(true)} className="absolute rounded-bl-xl h-2/6 w-[8.5%] bg-black right-0 top-16 grid-rows-3 grid">
					<div className="flex items-center text-xl  pr-4 hover:bg-zinc-900 hover:cursor-pointer p-4 text-gray-300">My Profile</div>
					<div className="flex items-center text-xl  pr-4 hover:bg-zinc-900 hover:cursor-pointer p-4 text-gray-300">Meeting + </div>
					<div className="flex items-center text-xl  pr-4 hover:bg-zinc-900 hover:cursor-pointer p-4 text-gray-300 rounded-bl-xl" onClick={signOutClick}>Sign Out</div>
				</div>}
			</div>
			<div className="">
				<div style={{backgroundImage: `url("https://images.pexels.com/photos/1573434/pexels-photo-1573434.jpeg?cs=srgb&dl=pexels-steve-johnson-1573434.jpg&fm=jpg")`}} className="absolute w-1/2 z-0 h-[230%] right-[-10%] bg-cover"></div>
				<div className="h-auto p-5 inline-block bg-zinc-950 w-auto relative top-24 text-9xl font-bold hover:cursor-pointer rounded-r-2xl" onMouseEnter={displayTextChange}>{displayText}</div>
				<div className="bg-gray-400 m-4 h-1/6 w-1/5 top-28 relative left-1/3 flex items-center justify-start p-4 text-black text-3xl font-semibold rounded-xl hover:h-1/5 transition-all hover:cursor-pointer hover:w-1/4 hover:bg-white hover:text-4xl">New Meeting +</div>
				<div className="bg-gray-400 m-4 h-1/6 w-1/5 relative top-32 left-1/3 grid grid-cols-[90%_0%] hover:grid-cols-[35%_65%] items-center justify-start p-4 text-black text-3xl font-semibold rounded-xl hover:h-1/5 transition-all hover:cursor-pointer hover:w-1/2 hover:bg-white hover:text-4xl" onMouseLeave={()=>{setMouseIn(false)}} onMouseEnter={()=>{setMouseIn(true)}}>Join meeting +
					{mouseIn && <form className=" w-full h-full rounded-xl bg-gray-300 flex">
						<input ref={meetingIdRef} className="w-full h-full bg-gray-300 focus:outline-none rounded-l-xl p-4 text-4xl" spellCheck={false} type="text" placeholder="Enter meeting ID"></input>
						<button type="submit" className="rounded-r-xl bg-blue-300 p-2">Enter</button>
					</form>}
				</div>
			</div>
		</div>
	)
}