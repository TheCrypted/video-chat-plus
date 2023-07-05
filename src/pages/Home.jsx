import {useEffect, useRef} from "react";
import * as stream from "stream";
import {CloseFullscreenRounded, OpenInFullRounded} from "@mui/icons-material";

export const Home = () => {
	let localStream = useRef(null);
	let remoteStream;
	let localStreamRef = useRef()
	let remoteStreamRef = useRef()
	const smallRef = useRef(localStreamRef)
	function getOppRef(ref){
		if(ref.current === localStreamRef.current){
			return remoteStreamRef
		} else {
			return localStreamRef
		}
	}
	function switchActiveScreen(){
		let streams = [remoteStreamRef.current, localStreamRef.current]
		streams.forEach((stream) =>{
			stream.classList.toggle("z-0")
			stream.classList.toggle("z-10")
			stream.classList.toggle("h-full")
			stream.classList.toggle("h-[33%]")
			stream.classList.toggle("w-full")
			stream.classList.toggle("m-4")
		})
		smallRef.current = getOppRef(smallRef.current)
	}
	function handleStreamClick(e, objRef){
		if(e.detail === 1 && smallRef.current === objRef.current ) {
			console.log("resize now")
		}
	}

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
		<>
			<div className="w-full h-full bg-zinc-900">
				<video ref={localStreamRef} className="hover:cursor-pointer m-4 absolute z-10 shadow-2xl rounded-lg h-[33%]" onClick={switchActiveScreen} autoPlay={true} playsInline={true}/>
				<video ref={remoteStreamRef} className="hover:cursor-pointer absolute z-0 shadow-2xl rounded-lg h-full w-full" autoPlay={true} playsInline={true}/>
				<div className="absolute flex items-center justify-center h-[6vh] rounded-full w-[6vh] bg-gray-500 bg-opacity-50 hover:bg-opacity-70 transition-all hover:m-3 hover:w-[7vh] hover:h-[7vh] right-0 m-4 ">
					<CloseFullscreenRounded style={{ color: 'white' }} fontSize="large" className="hover:opacity-100 opacity-30 hover:cursor-pointer w-full h-full" onClick={switchActiveScreen}/>
				</div>
				<div className="absolute z-20 h-[10%] w-1/5 bottom-[0%] left-[40%] mb-8 flex gap-4">
					<button className="rounded-full bg-red-500 w-1/3 m-2"></button>
					<button className="rounded-full bg-red-500 w-1/3 m-2"></button>
					<button className="rounded-full bg-red-500 w-1/3 m-2"></button>
				</div>
			</div>
		</>
	)
}