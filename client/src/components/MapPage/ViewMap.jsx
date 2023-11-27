import { Wrapper } from "@googlemaps/react-wrapper";
import Map from "./Map";

export default function ViewMap() {
	console.log(import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY)

	return (
		<>
			<div className="w-full h-screen relative flex justify-center">
				<span className="w-full h-full relative bg-slate-500 shadow-xl rounded-xl">
					<Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} version="beta" libraries={["marker"]}>
						<Map />
					</Wrapper>
				</span>
			</div>
		</>
	)
}