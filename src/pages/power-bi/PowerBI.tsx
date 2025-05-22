import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { PowerBIEmbed } from "powerbi-client-react";
import { models, Embed, Report } from "powerbi-client";

declare global {
  interface Window {
    report: Report;
  }
}
function PowerBI() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="col-span-2">
        <Button
          icon="pi pi-arrow-left"
          className="mb-4"
          label="Volver"
          text
          onClick={() => navigate("/landing")}
        />
      </div>

      <PowerBIEmbed
        embedConfig={{
          type: "report", // Supported types: report, dashboard, tile, visual, qna, paginated report and create
          id: "8276aea1-8c18-433c-b0fe-3c9a3033098c",
          embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId=8276aea1-8c18-433c-b0fe-3c9a3033098c&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d",
          accessToken:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Inp4ZWcyV09OcFRrd041R21lWWN1VGR0QzZKMCIsImtpZCI6Inp4ZWcyV09OcFRrd041R21lWWN1VGR0QzZKMCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvOWQxMmJmM2YtZTRmNi00N2FiLTkxMmYtMWEyZjBmYzQ4YWE0LyIsImlhdCI6MTczMTk1OTYzNiwibmJmIjoxNzMxOTU5NjM2LCJleHAiOjE3MzE5NjM2NzUsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84WUFBQUFNVHNOOHdjRDZoVzdpV0ppQWk2bzg0Vk96M0VKWGI0UUkrSHB6NlRFa3lTR0kwbWhOeXVWanUzcGVEVkZta1FBIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6Ijg3MWMwMTBmLTVlNjEtNGZiMS04M2FjLTk4NjEwYTdlOTExMCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiQUxWQVJFWiBSRVlFUyIsImdpdmVuX25hbWUiOiJMRU9OQVJETyBERSBKRVNVUyIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjE4Ni4xNjkuMTM4LjExMSIsIm5hbWUiOiJMRU9OQVJETyBERSBKRVNVUyBBTFZBUkVaIiwib2lkIjoiNGIwNjAxYTItYjE5OC00ODhjLWEwZGYtMjAyNmE2ZjQyNGRiIiwicHVpZCI6IjEwMDMyMDAyMTlDOTMwQzgiLCJyaCI6IjEuQVZrQVA3OFNuZmJrcTBlUkx4b3ZEOFNLcEFrQUFBQUFBQUFBd0FBQUFBQUFBQUJaQVBaWkFBLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IlYtaUhNcC0xMWhjX3JzaVE2ZG5naGdEUlBXYmZvRTBVaERyLTl5b1hWSVkiLCJ0aWQiOiI5ZDEyYmYzZi1lNGY2LTQ3YWItOTEyZi0xYTJmMGZjNDhhYTQiLCJ1bmlxdWVfbmFtZSI6ImxhbHZhcmV6ckB0ZWNub2NvbWZlbmFsY28uZWR1LmNvIiwidXBuIjoibGFsdmFyZXpyQHRlY25vY29tZmVuYWxjby5lZHUuY28iLCJ1dGkiOiJiY19kY2JuR3lFLXA5bmwxcTA0Q0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2lkcmVsIjoiMSAyNiJ9.OuV60Yg1hPv03Jot-QTQMAzNSdwCLxDgEcUu7Hxdtn3p73gnmI9AvG_CiskNXP2IVD4sncMXFVsCPGJp8C0UmBCfFye1Q150N5-6Hq42-t1pKgVyCnAjOfG8ZpcqeoHDMKHQQhUzpmXsU-adTdgn051mdLdoDokeyQxC2KGQDnj9hX83anbpLnTnULL6RNzQz9yfrC2Cnq_UTzkPOTfjD_9Om8ms_RDz5hX7Ui5k01OYop4pSoRLw3aNylqA-VlFLfWhMb-M_NqHMkoT79vS0IDyaazZkeDtt4qlvbG-aPGKfUKMknRLhURpL2asFLeKPRIeHwCDqHuOzxWhz7tFiA",
          tokenType: models.TokenType.Aad, // Use models.TokenType.Aad for SaaS embed
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false,
              },
            },
            background: models.BackgroundType.Transparent,
          },
        }}
        eventHandlers={
          new Map([
            ["loaded", () => {}],
            ["rendered", () => {}],
            ["error", () => {}],
            ["visualClicked", () => {}],
            ["pageChanged", () => {}],
          ])
        }
        cssClassName={"reportClass"}
        getEmbeddedComponent={(embeddedComponent: Embed) => {
          const report = embeddedComponent as Report;
          window.report = report;
        }}
      />
    </div>
  );
}

export default PowerBI;
