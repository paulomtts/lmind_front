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
        <div className="LoginPage text">
            <div className='overlay' />

            <div className='content'>
                <p className='title'>The Cookbook<span style={{
                    fontFamily: 'Arial',
                    fontWeight: '100',
                    fontSize: '0.75rem',
                    color: 'white',
                }}>alpha</span></p>
                <p className='text'>Share amazing recipes!</p>
                <br/>
                <br/>


                <Image
                    className="GoogleButton"
                    src={googleButtonImage}
                    title='Click to login with Google'
                    onClick={auth.login}
                />
            </div>
        </div>
    );
}
