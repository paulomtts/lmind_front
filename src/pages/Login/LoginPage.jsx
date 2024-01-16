/* Foreign dependencies */
import React from 'react';
import { Image } from '@chakra-ui/react';

/* Local dependencies */
import { useAuth } from '../../providers/AuthProvider';

import googleButtonImage from '../../assets/web_neutral_sq_ctn.svg';
import './LoginPage.css';

export default function LoginPage() {

    const auth = useAuth();

    return (
        <div className="flex justify-center items-center h-screen">
            <Image
                className="GoogleButton"
                src={googleButtonImage}
                title='Click to login with Google'
                onClick={auth.login}
            />
        </div>
    );
}
