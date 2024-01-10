function SidebarSubItem(props) {
    return <div className="SidebarSubItem" onClick={props.onClick}>
        {props.title}
    </div>
}

export default SidebarSubItem;