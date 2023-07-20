import BulkLoadDB from "./../../db/BulkLoad/bulkLoadDB.js";

export default class BulkLoadComponent {
  async findAllInformation(req, res) {
    try {
      const allInformation = await BulkLoadDB.getAllInformation();
      const [
        OrganizationalUnit,
        Ceco,
        PersonalArea,
        Direction,
        BussinessLine,
        Access,
        BudgetedResource,
        CareerLevel,
        Country,
        employeeSubGroup,
        PositionType,
        RequestType,
        Positions,
        PersonalBranch,
        FixedPercent,
        VariablePercent,
      ] = allInformation;
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          OrganizationalUnit,
          Ceco,
          PersonalArea,
          Direction,
          BussinessLine,
          Access,
          BudgetedResource,
          CareerLevel,
          Country,
          employeeSubGroup,
          PositionType,
          RequestType,
          Positions,
          PersonalBranch,
          FixedPercent,
          VariablePercent,
          message: 'Las informacion fue cargada exitosamente.'
        }
      });
    } catch (error) {
      console.log(`Error: ${error.toString()}`)
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }
}