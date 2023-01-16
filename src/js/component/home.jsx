import React, { useState, useEffect } from "react";

// include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";
import '../../styles/index.css';

// create your first component
const Home = () => {
	const [tareas, setTareas] = useState("");
	const [listaTareas, setlistaTareas] = useState([]);
	const [noTareas, setnoTareas] = useState("");
	useEffect(() => {


		fetch("https://assets.breatheco.de/apis/fake/todos/user/vlorenzo", {
			method: 'GET',
			headers: {
				"Content-Type": "application/json"
			}
		}).then(response => {
			if (!response.ok && response.status == 404) {
				return Promise.reject(response);
			}
			return response.json();
		}).then(result => {
			setlistaTareas(result);
			listaTareas.length === 0 ? setnoTareas("visually-hidden") : setnoTareas("");
		}).catch(error => {
			console.log('error', error);
			createUserAndFetch();
		});

	}, [])

	function handleTareas(e) {
		if (e.key === "Enter") {
			e.preventDefault();
			if (tareas === "") {
				alert("Falta informacion");
			} else {
				setTareas(e.target.value);

				const newArray = [
					...listaTareas, {
						label: tareas,
						done: false
					}
				];

				fetch("https://assets.breatheco.de/apis/fake/todos/user/vlorenzo", {
					method: 'PUT',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(newArray)

				}).then(response => {


					if (!response.ok) {
						return Promise.reject(response);
					}
					return response.json();
				}).then(result => {
					console.log(result);
					setlistaTareas(newArray);
					setnoTareas("visually-hidden");
					setTareas("");
				}).catch(error => {
					console.log('error', error)
				});

			}
		}

	}

	const eliminarListaTodos = () => {

		fetch("https://assets.breatheco.de/apis/fake/todos/user/vlorenzo", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify([])
		}).then((response) => {

			if (!response.ok) {
				return Promise.reject(response);
			}

			return response.json();
		}).then((data) => {
			setlistaTareas([]);
			console.log(data)


		}).catch(error => {

			alert("No se pudo borrar el elemento");
			console.error('error', error);

		});


	}


	function eliminarTareas(id) {

		if (listaTareas.length === 0) {
			setnoTareas("");

		}
		const newArray = listaTareas.filter((tarea, index) => index !== id);
		fetch("https://assets.breatheco.de/apis/fake/todos/user/vlorenzo", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newArray)
		}).then((response) => {

			if (!response.ok) {
				return Promise.reject(response);
			}

			return response.json();

		}).then((data) => {
			setlistaTareas(newArray);
			console.log(data)


		}).catch(error => {

			alert("No se pudo borrar el elemento");
			console.error('error', error);

		});


	}


	const createUserAndFetch = () => {
		fetch("https://assets.breatheco.de/apis/fake/todos/user/vlorenzo", {
			method: 'POST',
			body: JSON.stringify([]),
			headers: {
				"Content-Type": "application/json"
			},
			response: {
				"result": "ok"
			}
		}).then(response => {
			if (!response.ok) {
				return Promise.reject(response);
			}
		}).then(result => {
			fetch("https://assets.breatheco.de/apis/fake/todos/user/vlorenzo", {
				method: 'GET',
				headers: {
					"Content-Type": "application/json"
				}
			}).then(response => {
				if (!response.ok) {
					return Promise.reject(response);
				}
				return response.json();

			}).then(result => {
				setlistaTareas(result);
				listaTareas.length === 0 ? setnoTareas("visually-hidden") : setnoTareas("");
				setIsLoading(false);
			}).catch(error => {
				console.log('error', error)
			});
		}).catch(error => {
			console.log('error', error)
		});
	}
	return (
		<div className="container text-center">
			<h1 className="fw-light ">Todos</h1>
			<ul className="list-group list-group-flush">
				<li className="list-group-item fw-light">
					{" "}
					<input className="w-100 border border-0 fs-5" type="text" placeholder="What needs to be done?"
						onChange={
							(e) => setTareas(e.target.value)
						}
						value={tareas}
						onKeyDown={handleTareas}></input>
				</li>
				<li className={
					"list-group-item  fw-light " + noTareas
				}>
					No hay tareas, añadir tareas
				</li>
				{
					listaTareas.map((tarea, id) => (
						<li className="list-group-item fs-5 d-flex justify-content-between"
							id={id}
							key={id}>
							{
								tarea.label
							}
							<button type="button" className="btn-close fs-6 mt-1" id="eliminarcruz" aria-label="Close"
								onClick={
									() => eliminarTareas(id)
								}></button>
						</li>
					))
				}
				<li className="list-group-item text-left fs-6 fw-light text-black-50">
					{
						listaTareas.length
					}
					item left
					<button type="button" className="btn btn-danger float-end"
						onClick={eliminarListaTodos}>Delete All</button>
				</li>


				<li className="list-group-item  fw-light">
					{
						listaTareas.length
					}
					item left
				</li>
			</ul>
		</div>
	)
};

export default Home;
