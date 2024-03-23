import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [body, setBody] = useState("");
  const [method, setMethod] = useState("");
  const [data, setData] = useState([]);
  const [itemId, setItemId] = useState(null);
  const [error, setError] = useState(null);
  const [callFetch, setCallFetch] = useState(false);

  const httpConfigBody = (data, method) => {
    //ao dar o setBody vai acionar o useEffect que tem como gatinho o body, assim como setMethod e setItemId
    if (method === "POST") {
      setBody({
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
      setMethod("POST");
    } else if (method === "DELETE") {
      setBody({
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });
      setMethod("DELETE");
      setItemId(data);
    } else if (method === "PUT") {
      setBody({
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(data),
      });
      setMethod("PUT");
      setItemId(data.id);
    }
  };

  useEffect(() => {
    const httpRequest = async () => {
      let json;
      //para incluir dados novos
      if (method === "POST") {
        let fetchOptions = [url, body];
        const res = await fetch(...fetchOptions);
        json = await res.json();

        //para deleter um item
      } else if (method === "DELETE") {
        const deleteUrl = `${url}/${itemId}`;
        const res = await fetch(deleteUrl, body);
        json = await res.json();

        //para atualizar um item
      } else if (method === "PUT") {
        const updateUrl = `${url}/${itemId}`;
        let fetchOptions = [updateUrl, body];
        const res = await fetch(...fetchOptions);
        json = await res.json();
      }
      setCallFetch(json);
    };
    httpRequest();
    setBody("");
    setMethod("");
  }, [url, body, method, itemId]);

  //custom hook para resgatar os dados (GET)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.log(error.message);
        setError("Houve um erro ao carregar os dados.");
      }
    };
    fetchData();
  }, [url, callFetch]);

  const getById = async (itemId) => {
    let person;
    try {
      const getByIdUrl = `${url}/${itemId}`;
      const res = await fetch(getByIdUrl);
      person = await res.json();
      return person;
    } catch (error) {
      console.log(error.message);
      setError("Id não encontrado.");
    }
  };

  return { data, httpConfigBody, error, getById };
};

export default useFetch;
