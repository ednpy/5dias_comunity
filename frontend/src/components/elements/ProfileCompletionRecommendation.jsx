import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ProfileCompletionRecommendation = ({ perfilPersonalizado }) => {
    const fields = Object.keys(perfilPersonalizado);
    const incompleteFields = fields.filter((key) => !perfilPersonalizado[key]);

    const fieldNames = {
        about : 'Acerca de ti',
        experience: 'Experiencia',
        education: 'Educación',
        skills: 'Habilidades',
        photo_profile: 'Foto de Perfil',
        photo_cover: 'Foto de Portada',
        ubicacion: 'Ubicación',
        profesion: 'Profesión'
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Mejora tu perfil</h2>
            <p className="font-medium mb-2">Completa tus datos para mejorar tu perfil y que las personas puedan encontrarte.</p>
            {incompleteFields.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                    {fields.map((field) => (
                        <li key={field} className="capitalize text-gray-700 flex items-center">
                            {perfilPersonalizado[field] ? (
                                <FaCheckCircle className="text-green-500 mr-2" />
                            ) : (
                                <FaTimesCircle className="text-red-500 mr-2" />
                            )}
                            {fieldNames[field] || field.replace('_', ' ')}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="font-medium">¡Tu perfil está completo!</p>
            )}
        </div>
    );
};

export default ProfileCompletionRecommendation;