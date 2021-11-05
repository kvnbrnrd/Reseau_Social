import React, { useContext } from 'react';
import Log from '../components/Log';
import { UidContext } from '../components/AppContext';
import UpdateProfil from '../components/Profil/UpdateProfil';

const Profil = () => {

    const uid = useContext(UidContext);

    return (
        // Si l'utilisateur est connecté (si le uid est stocké au plus haut de notre page), quand il accède à la page profil, il pourra modifier son profil, sinon il tombera sur le formulaire d'inscription
        <div className="profil-page">
            {uid ? (
                <UpdateProfil />
            ) : (
                <div className="log-container">
                    <Log signin={false} signup={true} />
                    <div className="img-container">
                        <img src="./img/log.svg" alt="Login" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profil;