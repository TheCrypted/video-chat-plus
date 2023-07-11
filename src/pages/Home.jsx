import {useEffect, useRef, useState} from "react";
import * as stream from "stream";
import {CloseFullscreenRounded} from "@mui/icons-material";

export const Home = () => {
	let localStream = useRef(null);
	let remoteStream;
	let localStreamRef = useRef()
	let remoteStreamRef = useRef()
	const smallRef = useRef(localStreamRef)
	let [minState, setMinState] = useState(localStreamRef)
	const dragRef = useRef(false)
	const timeRef = useRef(new Date())
	function getOppRef(ref){
		if(ref.current.id === "local"){
			return remoteStreamRef
		} else {
			return localStreamRef
		}
	}
	//Put onMouseOver in-place of changeScreen Lock to experiment without boundary conditions
	function dragMinScreen(e){
		let targetDiv = minState.current
		let boxHeight = targetDiv.clientHeight
		let boxWidth = targetDiv.clientWidth
		let topDist = targetDiv.style.top
		topDist = topDist !== "" ? parseInt(topDist.split("px")[0]) : 0
		let leftDist = targetDiv.style.left
		leftDist = leftDist !== "" ? parseInt(leftDist.split("px")[0]) : 0
		let posX = e.clientX
		let posY = e.clientY
		let rightBorder = leftDist + 0.95*boxWidth > posX;
		let bottomBorder = topDist + 0.95*boxHeight > posY;
		let topBorder  = topDist + 0.05*boxHeight < posY;
		let leftBorder  = leftDist + 0.05*boxWidth < posX;
		console.log(rightBorder , leftBorder , topBorder , bottomBorder)
		if(rightBorder && leftBorder && topBorder && bottomBorder){
			console.log("location change")
			// changeScreenLoc(e)
			onMouseOver(e)
		} else {
			console.log("drag change")
			onMouseOver(e)
			// changeScreenLoc(e)
		}

	}
	function onMouseOver(e){
		let targetDiv = minState.current
		let posX = e.clientX
		let posY = e.clientY
		// let newWidth = posX - targetDiv.clientWidth - 2*targetDiv.style.left
		let topLength = typeof(targetDiv.style.top) === "string" ? 0: targetDiv.style.top
		let newHeight = posY  - topLength
		// targetDiv.style.width = `${newWidth}px`
		targetDiv.style.height = `${newHeight}px`
	}

	const changeScreenLoc = (e) => {
		let mouseX = e.clientX;
		let mouseY = e.clientY;
		let screenSelected = smallRef.current.current
		screenSelected.style.top = `${mouseY - screenSelected.clientHeight/2}px`
		screenSelected.style.left = `${mouseX - screenSelected.offsetWidth/2}px`
	}
	function switchActiveScreen(){
		if(!dragRef.current) {
			let streams = [remoteStreamRef.current, localStreamRef.current]
			streams.forEach((stream) => {
				stream.classList.toggle("z-0")
				stream.classList.toggle("z-10")
				stream.classList.toggle("h-full")
				stream.classList.toggle("h-[33%]")
				stream.classList.toggle("w-full")
				stream.classList.toggle("m-4")
			})

			smallRef.current = getOppRef(smallRef.current)
			setMinState(smallRef.current)
			// console.log("smallRef changed")
			let mainRef = getOppRef(smallRef.current)
			// console.log(mainRef.current)
			mainRef.current.style.top="0px"
			mainRef.current.style.left="0px"
			mainRef.current.style.width="100%"
			mainRef.current.style.height="100%"
		}
	}
	function handleStreamClick(e, objRef) {
		if (smallRef.current.current === objRef.current) {
			switchActiveScreen()
		}
	}

	useEffect(()=>{
		minState.current.style.width="auto"
		minState.current.style.height="33%"
		function removeEventListener(){
			//change to changeScreenLoc
			window.removeEventListener("mousemove", dragMinScreen)
			let timeNow = new Date()
			if(timeRef.current.getTime() - timeNow.getTime() < -250){
				setTimeout(() => {
					dragRef.current = false
				}, 100)
			} else {
				dragRef.current = false
			}
			timeRef.current = timeNow
		}
		function addEventListener(){
			timeRef.current= new Date();
			//change to changeScreenLoc
			window.addEventListener("mousemove", dragMinScreen)
			dragRef.current = true
		}
		minState.current.addEventListener("mousedown", addEventListener)
		window.addEventListener("mouseup", removeEventListener)
		return () => {
			minState.current.removeEventListener("mousedown", addEventListener)
			window.removeEventListener("mouseup", removeEventListener)
		}
	}, [minState])

	useEffect(()=>{
		let init = async() => {
			try {
				localStream.current = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
				localStreamRef.current.srcObject = localStream.current
			} catch (e) {
				console.log(e)
			}

		}
		init().catch(e => console.log(e))
		return function cleanup() {
			if (localStream.current) {
				localStream.current.getTracks().forEach((track) => track.stop());
			}
		};

	}, [])

	return (
		<div className="w-full h-full bg-zinc-900 overflow-hidden">
			<video id="local" ref={localStreamRef} className="hover:cursor-pointer m-4 absolute z-10 shadow-2xl rounded-lg h-[33%]" onClick={(e) => {
				handleStreamClick(e, localStreamRef)
			}} autoPlay={true} playsInline={true}/>
			<video id="remote" ref={remoteStreamRef} className="hover:cursor-pointer absolute z-0 shadow-2xl rounded-lg h-full w-full" onClick={(e) => {
				handleStreamClick(e, remoteStreamRef)
			}} autoPlay={true} playsInline={true}/>
			<div className="absolute flex items-center justify-center h-[6vh] rounded-full w-[6vh] bg-gray-500 bg-opacity-50 hover:bg-opacity-70 transition-all hover:m-3 hover:w-[7vh] hover:h-[7vh] right-0 m-4 ">
				<CloseFullscreenRounded style={{ color: 'white' }} fontSize="large" className="hover:opacity-100 opacity-30 hover:cursor-pointer w-full h-full" onClick={switchActiveScreen}/>
			</div>
			<div className="absolute z-20 h-[10%] w-1/5 bottom-[0%] left-[40%] mb-8 flex gap-4">
				<button className="rounded-full bg-red-500 w-1/3 m-2"></button>
				<button className="rounded-full bg-red-500 w-1/3 m-2"></button>
				<button className="rounded-full bg-red-500 w-1/3 m-2"></button>
			</div>
		</div>
	)
}