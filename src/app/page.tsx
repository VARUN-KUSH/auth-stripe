'use client'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


const page = () => {
    const { user } = useAuth();
    const router = useRouter();
    if(!user){
        router.push('/login')
    }
   else{
    router.push('/dashboard' )
   }
    return(
        <> </>
    )
}
export default page