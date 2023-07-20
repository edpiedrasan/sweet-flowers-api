import mysql from "mysql";
import config from "../config/config";

// export const connectionAuth = mysql.createConnection(
//   {
//     host: config.DB_HOST,
//     user: config.DB_USER,
//     password: config.DB_PASSWORD,
//     port: config.DB_PORT,
//     database: "mydb",
//   },
//   {
//     multipleStatements: true,
//   }
// );

export const connectionAuth = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
  },
  {
    multipleStatements: true,
  }
);

export const connectionSF = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb',
    multipleStatements: true

  },
  {
    multipleStatements: true,
  }
);

export const connectionMis = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "mis_ss",
  },
  {
    multipleStatements: true,
  }
);

export const connectionNP = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "new_position_db",
  },
  {
    multipleStatements: true,
  }
);

export const connectionPB = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "planning_mrs_db",
  },
  {
    multipleStatements: true,
  }
);

export const connectionMISDEV = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "misdev",
  },
  {
    multipleStatements: true,
  }
);

export const connectionMIS = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "MIS",
    multipleStatements: true

  },
  {
    multipleStatements: true,
  }
);

export const connectionCriticalParts = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "critical_parts_db",
  },
  {
    multipleStatements: true,
  }
);

export const connectionEma = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "coe_db",
  },
  {
    multipleStatements: true,
  }
);

export const connectionTL = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "targets_letter_db",
  },
  {
    multipleStatements: true,
  }
);

export const connectionDonations = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "donations",
  },
  {
    multipleStatements: true,
  }
);

export const connectionAccessPermissions = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "SS_Access_Permissions",
  },
  {
    multipleStatements: true,
  }
);

export const SalaryDBConnection = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "rrhh_as",
  },
  {
    multipleStatements: true,
  }
);

export const FFDBConnection = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "finance_flows",
  },
  {
    multipleStatements: true,
  }
);

export const MRDBConnection = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "MR",
  },
  {
    multipleStatements: true,
  }
);

export const FOConnection = mysql.createConnection(
  {
    host: config.DB_HOST_DT,
    user: config.DB_USER_DT,
    password: config.DB_PASSWORD_DT,
    port: 3306,
    database: "fabrica_de_ofertas",
  },
  {
    multipleStatements: true,
  }
);
export const IRConnection = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "incidents_reports",
  },
  {
    multipleStatements: true,
  }
);

export const UCConnection = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "update_contacts",
  },
  {
    multipleStatements: true,
  }
);

export const BSConnection = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "document_system",
  },
  {
    multipleStatements: true,
  }
);

export const HHConnection = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "hcm_hiring_db",
  },
  {
    multipleStatements: true,
  }
);
export const PBConnection = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "panama_bids_db",
  },

  {
    multipleStatements: true,
  },

);
export const CRBConnection = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "costa_rica_bids_db",
  },
  {
    multipleStatements: true,
  }
);

export const EIConnection = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "exitInterview",
  },
  {
    multipleStatements: true,
  }
);


export const AUPPConnection = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "autopp_db",
  },
  {
    multipleStatements: true,
  }
);

export const DMConnection = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "masterData",
  },
  {
    multipleStatements: true,
  }
);

export const DataBotSSConnection = mysql.createConnection(
  {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: "databot_db",
  },
  {
    multipleStatements: true,
  }
);

