import {useEffect, useRef, useState} from "react";
import * as stream from "stream";
import {CallEnd, CloseFullscreenRounded, Mic, MicOff, Videocam, VideocamOff} from "@mui/icons-material";

export const Home = () => {
	let localStream = useRef(null);
	let remoteStream;
	let localStreamRef = useRef()
	let remoteStreamRef = useRef()
	const smallRef = useRef(localStreamRef)
	let [minState, setMinState] = useState(localStreamRef)
	const dragRef = useRef(false)
	const timeRef = useRef(new Date())
	const muteRef = useRef(null)
	let [selfVidDisplay, setSelfVidDisplay] = useState(true)
	let [selfMute, setSelfMute] = useState(false)
	function getOppRef(ref){
		if(ref.current.id === "local"){
			return remoteStreamRef
		} else {
			return localStreamRef
		}
	}
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
		if(rightBorder  && bottomBorder){
			changeScreenLoc(e)
		} else {
			onMouseOver(e)
		}

	}
	function onMouseOver(e){
		let targetDiv = minState.current
		let posY = e.clientY
		let topLength = targetDiv.style.top === "" ? 0: parseInt(targetDiv.style.top.split("px")[0])
		console.log(topLength)
		let newHeight = posY  - topLength
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
			let mainRef = getOppRef(smallRef.current)
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
				localStream.current = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
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
			<video id="local" ref={localStreamRef} className="text-white hover:cursor-pointer m-4 absolute z-10 shadow-2xl rounded-lg h-[33%]" onClick={(e) => {
				handleStreamClick(e, localStreamRef)
			}} autoPlay={true} playsInline={true}>Hello</video>
			<video id="remote" ref={remoteStreamRef} className="hover:cursor-pointer absolute z-0 shadow-2xl rounded-lg h-full w-full" onClick={(e) => {
				handleStreamClick(e, remoteStreamRef)
			}} autoPlay={true} playsInline={true}/>
			<div className="absolute flex items-center justify-center h-[6vh] rounded-full w-[6vh] bg-gray-500 bg-opacity-50 hover:bg-opacity-70 transition-all hover:m-3 hover:w-[7vh] hover:h-[7vh] right-0 m-4 ">
				<CloseFullscreenRounded style={{ color: 'white' }} fontSize="large" className="hover:opacity-100 opacity-30 hover:cursor-pointer w-full h-full" onClick={switchActiveScreen}/>
			</div>
			<div className="absolute z-20 h-[10%] w-1/5 bottom-[0%] left-[42%] mb-12 flex gap-4">
				<button className="rounded-full bg-gray-500 hover:bg-gray-700 w-[7.5vh] h-[7.5vh] m-2" onClick={async ()=>{
					if(selfVidDisplay) {
						localStream.current.getVideoTracks().forEach((track)=> track.stop())
						localStreamRef.current.srcObject = null
						localStreamRef.current.poster = "https://preview.redd.it/zcgs03lgoy351.png?width=288&format=png&auto=webp&s=d9bf4b46713d7fdbf11b82a8e364ceee79724a9c"
					} else {
						localStream.current = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
						localStreamRef.current.srcObject = localStream.current
					}
					setSelfVidDisplay(!selfVidDisplay)
				}}>
					{
						selfVidDisplay && <Videocam className="text-white" fontSize="large"/>
					}
					{
						!selfVidDisplay && <VideocamOff className="text-white" fontSize="large"/>
					}
				</button>
				<button ref={muteRef} className="rounded-full bg-blue-500 hover:bg-blue-700 w-[7.5vh] h-[7.5vh] m-2" onClick={async (e)=>{
					e.stopPropagation();
					if(!selfMute){
						localStream.current.getAudioTracks().forEach((track)=> track.stop())
						muteRef.current.style.backgroundColor = "#6b7280"
					} else {
						localStream.current = await navigator.mediaDevices.getUserMedia({video: selfVidDisplay, audio: true});
						localStreamRef.current.srcObject = localStream.current
						muteRef.current.style.backgroundColor = "#3b82f6"
					}
					setSelfMute(!selfMute)
				}}>
					{
						selfMute ? <MicOff className="text-white" fontSize="large" /> : <Mic className="text-white" fontSize="large" />
					}
				</button>
				<button className="rounded-full bg-red-500 hover:bg-red-700 w-[12vh] h-[7.5vh] m-2">
					<CallEnd className="text-white" fontSize="large"/>
				</button>
			</div>
		</div>
	)
}