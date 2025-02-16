const columnService = require("../services/column");

// Adăugare coloană
exports.addColumn = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { columnName } = req.body;

    // Verifică dacă numele coloanei a fost transmis
    if (!columnName) {
      return res.status(400).json({
        success: false,
        message: "Column name is required.",
      });
    }

    // Construiește datele pentru coloană
    const columnData = { name: columnName };

    // Apelează serviciul pentru a adăuga coloana
    const updatedProject = await columnService.addColumnToProject(
      projectId,
      columnData
    );

    // Trimite răspunsul cu proiectul actualizat
    res.status(201).json({
      success: true,
      message: "Column added successfully.",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error adding column:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Editare coloană
exports.editColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { columnName } = req.body;
    console.log(columnName);

    if (!columnName) {
      return res.status(400).json({
        success: false,
        message: "Column name is required.",
      });
    }

    const updatedColumn = await columnService.editColumn(columnId, {
      name: columnName,
    });

    res.status(200).json({
      success: true,
      message: "Column updated successfully.",
      data: updatedColumn,
    });
  } catch (error) {
    console.error("Error editing column:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getColumns = async (req, res) => {
  try {
    const { projectId } = req.params;

    const columns = await columnService.getColumns(projectId);

    console.log("API Response from getColumns:", columns);
    res.status(200).json({ success: true, columns });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteColumn = async (req, res) => {
  try {
    const { columnId } = req.params; // Obține ID-ul coloanei din parametrii URL-ului

    if (!columnId) {
      return res.status(400).json({
        success: false,
        message: "Column ID is required.",
      });
    }

    await columnService.deleteColumn(columnId); // Apelăm serviciul pentru a șterge coloana

    return res.status(200).json({
      success: true,
      message: "Column deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting column:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the column.",
    });
  }
};
