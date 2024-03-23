import { useState } from "react";
import "./People.css";
import useFetch from "../../hooks/useFetch";

const People = ({ url }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [responsability, setResponsability] = useState("membro");
  const [active, setActive] = useState(true);
  const [birthday, setBirthday] = useState("");
  //usando o custom hook para resgatar a lista de pessoas
  const { data: people, httpConfigBody, error, getById } = useFetch(url);
  const [uptadeButton, setUpdateButton] = useState(false);
  let date;

  const handlebirthdayDate = (birthdayDate) => {
    date = birthdayDate.split("-");
    return `${date[2]}/${date[1]}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(name, responsability, active, birthday);
    const createdAt = new Date();

    const person = {
      name,
      birthday,
      responsability,
      active,
      createdAt,
    };

    httpConfigBody(person, "POST");

    //reset form
    setName("");
    setResponsability("membro");
    setActive(true);
    setBirthday("");
  };

  const handleDelete = (id) => {
    //console.log(`deletado id ${id}`);
    httpConfigBody(id, "DELETE");
  };

  const handleSelectedPerson = async (id) => {
    //console.log(`id ${id} selecionado`);
    const res = await getById(id);

    setId(res.id);
    setName(res.name);
    setResponsability(res.responsability);
    setActive(res.active);
    setBirthday(res.birthday);

    setUpdateButton(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    //console.log(`atualizado id ${id}`);
    const updatedAt = new Date();

    const person = {
      id,
      name,
      birthday,
      responsability,
      active,
      updatedAt
    };

    httpConfigBody(person, "PUT");

    //reset form
    setId("");
    setName("");
    setResponsability("membro");
    setActive(true);
    setBirthday("");
    setUpdateButton(false);
  };

  return (
    <div>
      <div className="cadastro">
        {error && <p>{error}</p>}
        {!error && (
          <form>
            <fieldset>
              <legend>Formulário de Cadastro</legend>
              {uptadeButton && (
                <label>
                  ID:
                  <input
                    type="text"
                    value={id}
                    name="id"
                    disabled
                    onChange={(e) => setId(e.target.value)}
                  />
                </label>
              )}
              <label>
                Nome:
                <input
                  type="text"
                  value={name}
                  name="name"
                  placeholder="Digite o nome"
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Função:
                <select
                  value={responsability}
                  name="responsability"
                  onChange={(e) => setResponsability(e.target.value)}
                >
                  <option value="lider">Líder</option>
                  <option value="liderEmTreinamento">
                    Líder Em Treinamento
                  </option>
                  <option value="anfitriao">Anfitrião</option>
                  <option value="membro">Membro</option>
                  <option value="visitante">Visitante</option>
                </select>
              </label>
              <label>
                Ativo
                <input
                  type="checkbox"
                  name="active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
              </label>
              <label>
                Aniversário:
                <input
                  type="date"
                  value={birthday}
                  name="birthday"
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </label>
              {!uptadeButton && (
                <input
                  id="registerButton"
                  type="submit"
                  value="Cadastrar"
                  onClick={handleSubmit}
                />
              )}
              {uptadeButton && (
                <input
                  id="updateButton"
                  type="submit"
                  value="Atualizar"
                  onClick={handleUpdate}
                />
              )}
            </fieldset>
          </form>
        )}
      </div>
      <div className="listagem">
        <h3>Listagem das pessoas cadastradas:</h3>
        {error && <p>{error}</p>}
        {!error && (
          <table id="people">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Função</th>
                <th>Status</th>
                <th>Aniversário</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>
                    {person.responsability === "visitante"
                      ? "Visitante"
                      : person.responsability === "membro"
                      ? "Membro"
                      : person.responsability === "lider"
                      ? "Líder"
                      : person.responsability === "liderEmTreinamento"
                      ? "Líder em Treinamento"
                      : person.responsability === "anfitriao"
                      ? "Anfitrião"
                      : ""}
                  </td>
                  <td>{person.active === true ? ` Ativo` : ` Inativo`}</td>
                  <td>
                    {person.birthday !== ""
                      ? handlebirthdayDate(person.birthday)
                      : ""}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(person.id)}>
                      Excluir
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleSelectedPerson(person.id)}>
                      Atualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <td>{people.length}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default People;
