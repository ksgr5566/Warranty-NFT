function HeaderItem({Icon, title}) {
  return (
    <div>
        <Icon className="h-8 mb-1"/>
        <p>{title}</p>
        <p className="mt-2 text-gray-600 bg-green-800">
          Hello this is awesome too much toooooo
        </p>
    </div>
  )
}

export default HeaderItem