'use client'
import React, { useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Dialog, Transition } from '@headlessui/react';

interface FormData {
    email: string;
    password: string;
}

const schema = Yup.object().shape({
    email: Yup.string().email('El email no es válido').required('Este campo es obligatorio'),
    password: Yup.string()
        .min(4, 'El password debe tener al menos 4 caracteres')
        .max(40, 'El nombre no puede tener más de 40 caracteres')
        .required('Este campo es obligatorio'),
});

function page() {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [formDataToSave, setFormDataToSave] = useState<FormData | null>(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const [open, setOpen] = useState(false);

    const onSubmit = (data: FormData) => {
        console.log('Form Data:', data);
        // Clear the form fields
        reset();
        // Llamar a la función para enviar datos al backend
        sendFormDataToBackend(data);
    };


    const sendFormDataToBackend = async (dataContact: FormData) => {
        try {
            console.log('Enviando datos al backend:', dataContact);
            const response = await fetch('http://186.64.113.85:3001/account/loginAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataContact),
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log('Respuesta del backend:', responseData);
                // Guardar el token en el estado local
                setAccessToken(responseData.access_token);
                localStorage.setItem('accessToken', responseData.access_token);
                console.log('Datos enviados correctamente al backend');
                router.push('/admin');
            } else {
                console.error('Error al enviar datos al backend');
                setOpen(true);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setOpen(true);
        }
    };

    return (
        <>
            <section className='section-login'>
                <div className="flex min-h-full max-w-xs flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img className="mx-auto h-28" src="https://raw.githubusercontent.com/Jonvtvn/Other/main/logo.png" />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Inicia sesiónnnn
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Email
                                </label>
                                <div className="mt-2">
                                    <input
                                        {...register('email')}
                                        id="email"
                                        name="email"
                                        type="email"

                                        className="bg-gray-50 border border-neutral-900 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                                    />
                                    <small className="text-red-500 text-base font-bold my-2 text-left">{errors?.email ? errors?.email.message : 'ㅤ'}</small>
                                </div>
                            </div>

                            <div>
                                <div className="">
                                    <label className="block text-sm font-medium leading-6 text-gray-900">
                                        Contraseña
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        {...register('password')}
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"

                                        className="bg-gray-50 border border-neutral-900 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                                    />
                                    <small className="text-red-500 text-base font-bold my-2 text-left">{errors?.password ? errors?.password.message : 'ㅤ'}</small>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex mx-auto w-36 justify-center rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-00 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Iniciar sesión
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-neutral-900 bg-opacity-60 transition-opacity" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="">
                                            <div className="mt-10 text-center">
                                                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-black">
                                                    Credenciales Invalidas
                                                </Dialog.Title>
                                                <div className="mt-5">
                                                    <p className="text-base font-medium text-black">
                                                        No podemos encontrar una cuenta con estas credenciales...
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => setOpen(false)}>
                                            Cerrar
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

export default page