import '../App.css'
import '../styles/Dashboard.css'
import '../styles/AdminComponents.css'
import '../styles/RoleDashboards.css'
import { RoleDashboardSelector } from '../components/RoleDashboardSelector'

export function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      <RoleDashboardSelector />
    </div>
  )
}

export default Dashboard
