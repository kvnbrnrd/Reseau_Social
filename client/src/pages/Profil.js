import React, { useContext } from 'react';
import Log from '../components/Log';
import { UidContext } from '../components/AppContext';

const Profil = () => {

    const uid = useContext(UidContext);

    return (
        // Si l'utilisateur est connecté (si le uid est stocké au plus haut de notre page), on renvoie l'utilisateur vers la page d'accueil updatée, sinon on lui affiche le formulaire d'inscription
        <div className="profil-page">
            {uid ? (
                <h1>UPDATE PAGE</h1>
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