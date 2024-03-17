import { useState, useRef, useEffect } from "react"
const VIDatosMaterias = [
     {id: 1, nombre: "AM1", estado:1, materiasQueActualiza:[9, 10, 17, 19, 22], materiasQueNecesitaRegulares:[], materiasQueNecesitaAprobadas:[]},
     {id: 2, nombre: "AGA", estado:1, materiasQueActualiza:[9, 17, 19, 22], materiasQueNecesitaRegulares:[], materiasQueNecesitaAprobadas:[]},
     {id: 3, nombre: "FIS1", estado:1, materiasQueActualiza:[10, 21], materiasQueNecesitaRegulares:[], materiasQueNecesitaAprobadas:[]},
     {id: 4, nombre: "INGLES", estado:1, materiasQueActualiza:[12, 23], materiasQueNecesitaRegulares:[], materiasQueNecesitaAprobadas:[]},
     {id: 5, nombre: "LED/MAD", estado:1, materiasQueActualiza:[13, 14, 20], materiasQueNecesitaRegulares:[], materiasQueNecesitaAprobadas:[]},
     {id: 6, nombre: "AED", estado:1, materiasQueActualiza:[13, 14, 16, 20, 23], materiasQueNecesitaRegulares:[], materiasQueNecesitaAprobadas:[]},
     {id: 7, nombre: "ACO", estado:1, materiasQueActualiza:[15, 21], materiasQueNecesitaRegulares:[], materiasQueNecesitaAprobadas:[]},
     {id: 8, nombre: "SPN/SOR", estado:1, materiasQueActualiza:[16, 23], materiasQueNecesitaRegulares:[], materiasQueNecesitaAprobadas:[]},
    {id: 11, nombre: "ISO", estado:1, materiasQueActualiza:[24], materiasQueNecesitaRegulares:[], materiasQueNecesitaAprobadas:[]},
     {id: 9, nombre: "AM2", estado:0, materiasQueActualiza:[22, 28, 29, 32], materiasQueNecesitaRegulares:[1, 2], materiasQueNecesitaAprobadas:[]},
    {id: 10, nombre: "FIS2", estado:0, materiasQueActualiza:[29,], materiasQueNecesitaRegulares:[1, 3], materiasQueNecesitaAprobadas:[]},
    {id: 12, nombre: "INGLES 2", estado:0, materiasQueActualiza:[36], materiasQueNecesitaRegulares:[4], materiasQueNecesitaAprobadas:[]},
    {id: 13, nombre: "SSL", estado:0, materiasQueActualiza:[19, 25], materiasQueNecesitaRegulares:[5, 6], materiasQueNecesitaAprobadas:[]},
    {id: 14, nombre: "PPR", estado:0, materiasQueActualiza:[20, 23, 25], materiasQueNecesitaRegulares:[5, 6], materiasQueNecesitaAprobadas:[]},
    {id: 15, nombre: "SOP", estado:0, materiasQueActualiza:[26], materiasQueNecesitaRegulares:[7], materiasQueNecesitaAprobadas:[]},
    {id: 16, nombre: "ASI", estado:0, materiasQueActualiza:[19, 20, 23, 30], materiasQueNecesitaRegulares:[6,8], materiasQueNecesitaAprobadas:[]},
    {id: 17, nombre: "PYE", estado:0, materiasQueActualiza:[27, 28, 31, 32], materiasQueNecesitaRegulares:[1,2], materiasQueNecesitaAprobadas:[]},
    {id: 18, nombre: "ECO", estado:1, materiasQueActualiza:[30, 33, 34], materiasQueNecesitaRegulares:[], materiasQueNecesitaAprobadas:[]},
    {id: 19, nombre: "BDD", estado:0, materiasQueActualiza:[25, 32], materiasQueNecesitaRegulares:[13,16], materiasQueNecesitaAprobadas:[1,2]},
    {id: 20, nombre: "DDS", estado:0, materiasQueActualiza:[25, 35, 36], materiasQueNecesitaRegulares:[14,16], materiasQueNecesitaAprobadas:[5,6]},
    {id: 21, nombre: "COM", estado:0, materiasQueActualiza:[26, 35], materiasQueNecesitaRegulares:[], materiasQueNecesitaAprobadas:[3,7]},
    {id: 22, nombre: "ANumerico", estado:0, materiasQueActualiza:[27, 29, 31], materiasQueNecesitaRegulares:[9], materiasQueNecesitaAprobadas:[1,2]},
    {id: 23, nombre: "DSI", estado:0, materiasQueActualiza:[25, 30, 33, 36], materiasQueNecesitaRegulares:[14,16], materiasQueNecesitaAprobadas:[4,6,8]},
    {id: 24, nombre: "LEG", estado:0, materiasQueActualiza:[34], materiasQueNecesitaRegulares:[11], materiasQueNecesitaAprobadas:[]},
    {id: 25, nombre: "Ing y Calidad Software", estado:0, materiasQueActualiza:[36], materiasQueNecesitaRegulares:[19,20,23], materiasQueNecesitaAprobadas:[13,14]},
    {id: 26, nombre: "Redes de datos", estado:0, materiasQueActualiza:[35, 36], materiasQueNecesitaRegulares:[15,21], materiasQueNecesitaAprobadas:[]},
    {id: 27, nombre: "IOP", estado:0, materiasQueActualiza:[33], materiasQueNecesitaRegulares:[17,22], materiasQueNecesitaAprobadas:[]},
    {id: 28, nombre: "SIM", estado:0, materiasQueActualiza:[31,32], materiasQueNecesitaRegulares:[17], materiasQueNecesitaAprobadas:[9]},
    {id: 29, nombre: "Tec Automat", estado:0, materiasQueActualiza:[], materiasQueNecesitaRegulares:[10,22], materiasQueNecesitaAprobadas:[9]},
    {id: 30, nombre: "Adm sistemas inf", estado:0, materiasQueActualiza:[34, 35, 36], materiasQueNecesitaRegulares:[18,23], materiasQueNecesitaAprobadas:[16]},
    {id: 31, nombre: "IA", estado:0, materiasQueActualiza:[], materiasQueNecesitaRegulares:[28], materiasQueNecesitaAprobadas:[17,22]},
    {id: 32, nombre: "Ciencia de datos", estado:0, materiasQueActualiza:[], materiasQueNecesitaRegulares:[28], materiasQueNecesitaAprobadas:[17,19]},
    {id: 33, nombre: "Sist Gestion", estado:0, materiasQueActualiza:[], materiasQueNecesitaRegulares:[18,27], materiasQueNecesitaAprobadas:[23]},
    {id: 34, nombre: "Gestión Gerencial", estado:0, materiasQueActualiza:[], materiasQueNecesitaRegulares:[24,30], materiasQueNecesitaAprobadas:[18]},
    {id: 35, nombre: "Seguridad", estado:0, materiasQueActualiza:[], materiasQueNecesitaRegulares:[26,30], materiasQueNecesitaAprobadas:[20,21]},
    {id: 36, nombre: "Proyecto Final", estado:0, materiasQueActualiza:[], materiasQueNecesitaRegulares:[25,26,30], materiasQueNecesitaAprobadas:[12,20,23]},
];




export const MateriasDisplay = () => {
    const [datosMaterias, setDatosMaterias] = useState(VIDatosMaterias);
    const datosMateriasRef = useRef(datosMaterias);

    useEffect(() => {
        datosMateriasRef.current = datosMaterias;
    }, [datosMaterias]);
    useEffect(() => {
        datosMateriasRef.current.forEach((x)=>{
            notificarMaterias(x.id)
        })
    });

    const preguntarPorMaterias = (id) => {
        let currentMateria = datosMateriasRef.current.find((x)=>x.id === id);
        let idsMateriasReg = currentMateria.materiasQueNecesitaRegulares;
        let idsMateriasApr = currentMateria.materiasQueNecesitaAprobadas;
        
        if (datosMateriasRef.current.filter((x) => idsMateriasReg
            .filter((y) => y === x.id).length > 0 )
            .filter((x) => x.estado < 2).length > 0) return false;

        else if(datosMateriasRef.current.filter((x) => idsMateriasApr
            .filter((y) => y === x.id).length > 0 )
            .filter((x) => x.estado < 3).length > 0) return false;
            
        else return true; // Esto significa que la materia se puede cursar.
    }

    // Estas dos funciones son una copia de updateEstadoMateria:
    // Está modificada para ser utilizada en recursiones de muchos pasos y que
    // sea un método "seguro": ejecutarse repetidas veces lleva al mismo output

    const unlockMateria = (id) => {
        setDatosMaterias(prevState => {
            return prevState.map(materia => {
                if (materia.id === id) {
                    return {
                        ...materia,
                        estado: materia.estado < 3 ? 1 : 0
                    };
                }
                return materia;
            });
        });
    }

    const lockMateria = (id) =>{
        setDatosMaterias(prevState => {
            return prevState.map(materia => {
                if (materia.id === id) {
                    return {
                        ...materia,
                        estado: 0
                    };
                }
                return materia;
            });
        });
    };

    
    // Solo se tiene que ejecutar una vez por cada vez que se toque un botón válido.
    // Aumenta el estado de la materia en 1 o lo vuelve a 1 si es igual a tres.
    const updateEstadoMateria = (id) => {
        setDatosMaterias(prevState => {
            return prevState.map(materia => {
                if (materia.id === id) {
                    return {
                        ...materia,
                        estado: materia.estado < 3 ? materia.estado + 1 : 1
                    };
                }
                return materia;
            });
        });
    };

    // 
    
    const notificarMaterias = (id) => {
        let currentMateria = datosMateriasRef.current.find((x)=>x.id === id);
        let idsMateriasNotif = currentMateria.materiasQueActualiza;
    
        idsMateriasNotif.forEach(idMat => {
            let materiaToUpdate = datosMateriasRef.current.find((x)=>x.id === idMat);
            if(preguntarPorMaterias(idMat) && materiaToUpdate.estado === 0){
                unlockMateria(idMat);
            } else if(!preguntarPorMaterias(idMat) && materiaToUpdate.estado !== 0){
                lockMateria(idMat);
            }
        });
    }
    
    // Esta es la función que acciona el botón. Si el estado lo permite, entonces actualiza el estado
    // a "se puede cursar", "regular" o "aprobada".
    
    const handleCambioEstado = (id) => {
        if (datosMateriasRef.current.find((x) => x.id === id).estado !== 0) {
            console.log("se puede cursar");
            updateEstadoMateria(id);
            // Notificar materias solo si el estado cambió
            console.log(datosMateriasRef.current);
        } else {
            console.log("no se puede cursar");
        }
        notificarMaterias(id);

    };
    const getStyle = (estado) => {
        switch (estado) {
            case 0:
                return "rounded mx-1 my-1 px-2 py-2 col-5 col-lg-2 btn btn-dark text-white";
            case 1:
                return "rounded mx-1 my-1 px-2 py-2 col-5 col-lg-2 btn btn-light";
            case 2:
                return "rounded mx-1 my-1 px-2 py-2 col-5 col-lg-2 btn btn-secondary";
            default:
                return "rounded mx-1 my-1 px-2 py-2 col-5 col-lg-2 btn btn-primary"; 
        }
    }

    return(<div>
        <div className="container-fluid">
            <hr ></hr>
            primero
            <div className="row">
                {datosMaterias.slice(0,9).map((x) => 
                    <button disabled={false} className={getStyle(x.estado)} onClick={()=>{handleCambioEstado(x.id)}}>
                        <h4>{x.nombre}</h4>
                    </button>
                )
                }
            </div>
            <hr/>
            segundo
            <div className="row">
                {datosMaterias.slice(9,17).map((x) => 
                    <button disabled={false} className={getStyle(x.estado)} onClick={()=>{handleCambioEstado(x.id)}}>
                        <h4>{x.nombre}</h4>
                    </button>
                )
                }
            </div>
            <hr/>
            tercero
            <div className="row">
                {datosMaterias.slice(17,23).map((x) => 
                    <button disabled={false} className={getStyle(x.estado)} onClick={()=>{handleCambioEstado(x.id)}}>
                        <h4>{x.nombre}</h4>
                    </button>
                )
                }
            </div>
            <hr/>
            cuarto
            <div className="row">
                {datosMaterias.slice(23,30).map((x) => 
                    <button disabled={false} className={getStyle(x.estado)} onClick={()=>{handleCambioEstado(x.id)}}>
                        <h4>{x.nombre}</h4>
                    </button>
                )
                }
            </div>
            <hr/>
            quinto
            <div className="row">
                {datosMaterias.slice(30,36).map((x) => 
                    <button disabled={false} className={getStyle(x.estado)} onClick={()=>{handleCambioEstado(x.id)}}>
                        <h4>{x.nombre}</h4>
                    </button>
                )
                }
            </div>
            <hr/>
        </div>
    </div>)
}; 