function Spinner({height, width}) {
    return (
        <span className={`border-gray-300 block h-${height} w-${width} animate-spinner rounded-full border-4 border-t-blue-600 shadow-sm`}/>
    )
}

export default Spinner