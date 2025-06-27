import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const CreateTreeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    common_name: "",
    species: "",
    family: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from("trees")
        .insert([formData])
        .select();

      if (error) throw error;

      if (data) {
        navigate(`/tree/${data[0].id}`); // Redirect to new tree's page
      }
    } catch (error) {
      console.error("Error creating tree:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="form-container">
      <h2>Create New Tree</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Common Name*</label>
          <input
            type="text"
            name="common_name"
            value={formData.common_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Species</label>
          <input
            type="text"
            name="species"
            value={formData.species}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Family</label>
          <input
            type="text"
            name="family"
            value={formData.family}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <button type="submit" className="submit-btn">
          Create Tree
        </button>
      </form>
    </div>
  );
};

export default CreateTreeForm;
