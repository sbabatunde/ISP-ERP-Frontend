import Sidebar from "../layout/Sidebar"
import {cn} from "../lib/cn"

const Layout = () => {
    return(
        <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-900">
            <Sidebar />
            <div></div>
        </div>
    )
}

export default Layout;