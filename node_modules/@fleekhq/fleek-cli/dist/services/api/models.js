"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteFragment = `
  ... on Site {
    id
    name
    platform
  }
`;
exports.FullSiteFragment = `
  ... on Site {
    id
    name
    platform
    buildSettings {
      buildCommand
      baseDirectoryPath
      publishDirectoryPath
      dockerImage
      environmentVariables { name value }
    }
    deploySettings {
      autoPublishing
      prDeployPreviews
      dfinityUseProxy
      source {
         ... on Repository { type url branch }
         ... on IpfsSource { cid }
      }
    }
  }
`;
var DeployStatus;
(function (DeployStatus) {
    DeployStatus["InProgress"] = "IN_PROGRESS";
    DeployStatus["Deployed"] = "DEPLOYED";
    DeployStatus["Failed"] = "FAILED";
    DeployStatus["Cancelled"] = "CANCELLED";
})(DeployStatus = exports.DeployStatus || (exports.DeployStatus = {}));
exports.DeployFragment = `
  ... on Deploy {
    id
    status
    published
  }
`;
