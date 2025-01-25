import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api, { setAuthToken } from "../libs/apiCalls";
import { auth } from "../libs/firebaseConfig";
import { useStore } from "../store";
import { Button } from "./ui/button";

const Auth = () => {
    const { setCredentials } = useStore();
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            const loginData = {
                email: result.user.email,
                firebaseToken: await result.user.getIdToken()
            };

            const { data } = await api.post("/auth/login", loginData);

            if (data?.token) {
                const userInfo = { ...data.user, token: data.token };
                localStorage.setItem("user", JSON.stringify(userInfo));
                setCredentials(userInfo);
                setAuthToken(data.token);
                toast.success('Successfully logged in!');
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error?.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <Button
                onClick={signInWithGoogle}
                variant="outline"
                className="w-full max-w-sm text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
                type="button"
            >
                <FcGoogle className="mr-2 size-5" />
                Sign in with Google
            </Button>
        </div>
    );
};

export default Auth;
