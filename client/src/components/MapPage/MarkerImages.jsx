import { useEffect, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { createRoot } from "react-dom/client"
import { useRef } from "react";

const MarkerImages = ({ map }) => {
	const [data, setData] = useState()
	console.log(data)
	const [loading, setLoading] = useState(true)
	const rootRef = useRef()

	const handleMarkerClick = (id) => {
		console.log("Marker clicked", id)
		console.log(map.center.lat())
	}

	function handleClusterer() {
		const markers = data.map((marker) => {
			const container = document.createElement("div")
			
			const warningIcon = (marker.category == 1) ? 'red-alert-100.png' : 'yellow-alert-100.png'
			rootRef.current = createRoot(container)
			rootRef.current.render(
				<div className="w-12 h-12 border-2 border-purple-100  rounded-full overflow-hidden text-white relative">
					{<img
						src={`./icons/${warningIcon}`}
						alt="image"
						className="object-cover object-center w-full h-full"
					/>}
				</div>
			)
			const markerElement = new google.maps.marker.AdvancedMarkerView({
				position: { lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) },
				content: container,
			});
			markerElement.addListener("click", () => handleMarkerClick(marker.id))
			return markerElement
		})
		const markerClusterer = new MarkerClusterer({ markers, map });
		console.log("Clusterer is ready");
		return markerClusterer;
	}

	const handleFetch = async () => {
		console.log("Locations are fetching...");
		const res = await fetch("http://localhost:8080/api/detects")
		const data = await res.json()
		console.log(data)
		setData(data)
		setLoading(false)
	}
	useEffect(() => {
		if (!loading) {
			const markerClusterer = handleClusterer()
		} else {
			handleFetch()
		}
	}, [data, loading])
}
export default MarkerImages