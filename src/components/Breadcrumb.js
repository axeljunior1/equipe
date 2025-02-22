import React from 'react';
import {Breadcrumb} from 'react-bootstrap';
import {useLocation, useNavigate} from 'react-router-dom';

const BreadcrumbNav = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Découper le chemin en segments
    const pathSegments = location.pathname.split('/').filter((segment) => segment);

    // Générer les liens pour chaque segment
    const breadcrumbs = pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        return { label: decodeURIComponent(segment), path };
    });

    return (
        <Breadcrumb className="m-5">
            {/* Ajouter le lien vers "Accueil" */}
            <Breadcrumb.Item onClick={() => navigate('/')} style={{ cursor: 'pointer', textDecoration: 'none'  }}>
                Accueil
            </Breadcrumb.Item>

            {/* Générer dynamiquement les autres éléments */}
            {breadcrumbs.map((breadcrumb, index) => (
                <Breadcrumb.Item
                    key={index}
                    active={index === breadcrumbs.length - 1}
                    onClick={() => {
                        if (index !== breadcrumbs.length - 1) {
                            navigate(breadcrumb.path);
                        }
                    }}
                    style={{
                        cursor: index !== breadcrumbs.length - 1 ? 'pointer' : 'default', textDecoration: 'none',
                    }}
                >
                   {breadcrumb.label}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
};

export default BreadcrumbNav;
