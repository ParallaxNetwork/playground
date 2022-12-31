
import dynamic from "next/dynamic"

const ProfilePage = dynamic(() => import('../../src/pages/profile/ProfilePage'), {
    ssr: false
})
const ProfilePages = () => {
    return <ProfilePage />
}


export default ProfilePages