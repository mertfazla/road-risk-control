import { useEffect, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { createRoot } from "react-dom/client"
import { useRef } from "react";

const MarkerImages = ({ map }) => {
	const [data, setData] = useState()
	const [loading, setLoading] = useState(true)
	const rootRef = useRef()

	const handleMarkerClick = (id) => {
		console.log(`Marker ID:${id} Location:${map.center.lat()} ${map.center.lng()}`);
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
		console.log("Locations are fetching for adress...");
		const res = await fetch("http://localhost:8080/api/marker")
		const data = await res.json()
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