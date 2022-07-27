import LoadingSvg from "./svgs/LoadingSvg"

function Loading({content}) {
  return (
    <div className="flex justify-center items-center">
          <div role="status">
            <LoadingSvg />
            <span className="sr-only">Loading...</span>
          </div>
          <p>{content}</p>
    </div>
  )
}

export default Loading