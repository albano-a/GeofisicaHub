import { h } from "preact";
import { useState } from "preact/hooks";

const siteLinks = [
  {
    href: "http://www.sbgf.org.br/",
    title: "Sociedade Brasileira de Geofísica - SBGf",
    description: "Maior sociedade de Geofísica da América Latina.",
  },
  {
    href: "https://geosgb.sgb.gov.br/",
    title: "GeoSBG - Serviço Geológico do Brasil",
    description:
      "Site que possui diversos dados, informações e produtos do Serviço Geológico Brasileiro.",
  },
  {
    href: "https://www.sgb.gov.br/",
    title: "Companhia de Pesquisa de Recursos Minerais (CPRM)",
  },
  {
    href: "https://seg.org/",
    title: "Society of Exploration Geophysicists (SEG)",
    description: "Uma das maiores sociedades de Geofísica do mundo.",
  },
  {
    href: "https://pubs.geoscienceworld.org/",
    title: "GeoScienceWorld",
    description: "Site de Publicações Geofísicas",
  },
  {
    href: "http://icgem.gfz-potsdam.de/home",
    title: "International Centre for Global Earth Models (ICGEM)",
    description:
      "Centro internacional que fornece modelos globais da Terra, especialmente modelos gravitacionais e magnéticos, para apoiar pesquisas em geociências e disciplinas relacionadas.",
  },
  {
    href: "https://museuhe.com.br/",
    title: "Museu de Minerais, Minérios e Rochas Heinz Ebert",
    description:
      "Museu que possui diversas informações sobre centenas de minerais.",
  },
];

const softwareLinks = [
  {
    href: "https://www.geosoft.com/",
    title: "Geosoft",
    description: "Análise e interpretação de dados geocientíficos.",
  },
  {
    href: "https://www.agisoft.com/",
    title: "Agisoft Metashape (Fotogrametria)",
    description:
      "Permite a criação de modelos tridimensionais a partir de fotografias",
  },
  {
    href: "https://qgis.org/",
    title: "QGIS (Open Source GIS)",
    description: "Software muito utilizado para análise espacial e mapeamento.",
  },
  {
    href: "https://www.opendtect.org/",
    title: "OpendTect",
    description:
      "Software especializado em interpretação e visualização de dados sísmicos, facilitando a análise geofísica tridimensional.",
  },
  {
    href: "https://wiki.seismic-unix.org/start",
    title: "Seismic Unix (SU)",
    description:
      "Ferramenta para processamento e análise de dados sísmicos, amplamente utilizada na indústria da geofísica.",
  },
  {
    href: "https://www.generic-mapping-tools.org/",
    title: "GMT (Generic Mapping Tools)",
    description:
      "Conjunto de ferramentas para criar mapas e gráficos geofísicos, útil para visualização e análise de dados espaciais.",
  },
  {
    href: "https://simpeg.xyz/",
    title: "SimPEG (Simulation and Parameter Estimation in Geophysics)",
    description:
      "Software especializado em interpretação e visualização de dados sísmicos, facilitando a análise geofísica tridimensional.",
  },
  {
    href: "https://www.python.org/",
    title: "Python",
    description: "Linguagem de programação especializada em análise de dados.",
  },
];

const databaseLinks = [
  {
    href: "https://geomaps.anp.gov.br/geoanp/",
    title: "GeoMaps | ANP",
    description:
      "Mapa da Agência Nacional do Petróleo (ANP) que contém diversas informações sobre bacias terrestres e marítimas.",
  },
  {
    href: "https://www.gebco.net/",
    title: "GEBCO",
    description:
      "Site que possui diversos dados de batimetria de diversas áreas do mundo.",
  },
  {
    href: "https://ds.iris.edu/ds/nodes/dmc/tools/##",
    title: "IRIS (Incorporated Research Institutions for Seismology)",
    description:
      "Fornece dados sísmicos globais e recursos educacionais, sendo uma fonte abrangente para estudos relacionados a terremotos.",
  },
  {
    href: "https://earthquake.usgs.gov/earthquakes/search/",
    title: "USGS (U.S. Geological Survey) Earthquake Hazards Program",
    description:
      "Catálogo de terremotos mantidos pelo USGS, oferecendo informações detalhadas sobre eventos sísmicos em todo o mundo.",
  },
  {
    href: "https://www.ncei.noaa.gov/products/marine-trackline-geophysical-data",
    title: "NOAA Nactional Centers for Environmental Information (NCEI)",
    description:
      "Oferece uma ampla gama de conjuntos de dados geofísicos, incluindo informações sobre o ambiente marinho, clima e geociências.",
  },
  {
    href: "https://www.emdat.be/",
    title: "EM-DAT (Emergency Events Database)",
    description:
      "Base de dados que registra informações sobre desastres naturais e tecnológicos em todo o mundo, facilitando estudos de impacto e resposta.",
  },
  {
    href: "https://wiki.seg.org/wiki/Open_data",
    title: "SEG Wiki - Data Repositories",
    description:
      "Lista de repositórios de dados geofísicos mantida pela SEG, abrangendo várias disciplinas da geofísica.",
  },
  {
    href: "http://tech.usgin.org/",
    title: "NGDS (National Geothermal Data System)",
    description:
      "Exploração de dados geotérmicos, oferecendo acesso a conjuntos de dados relacionados à energia geotérmica.",
  },
  {
    href: "https://search.earthdata.nasa.gov/search?lat=-23.073447711857426&long=-43.91015625&zoom=7",
    title: "NASA Earthdata",
    description:
      "Portal da NASA para acesso a uma ampla variedade de dados terrestres, incluindo observações por satélite e informações ambientais.",
  },
  {
    href: "https://www.ga.gov.au/data-pubs/nmfc",
    title:
      "Geoscience Australia - National Mineral and Fossil Collection Database",
    description:
      "Banco de dados abrangente contendo informações sobre a coleção nacional de minerais e fósseis da Geoscience Australia.",
  },
];

const renderLinks = (links) => (
  <ul className="is-size-6 has-text-justified px-6 mx-1">
    {links.map((link) => (
      <li key={links.ref}>
        <a href={links.href}>
          <b>{link.title}</b>
        </a>
        {link.description ? ` - ${link.description}` : ""}
      </li>
    ))}
  </ul>
);

const ResourcesTab = () => {
  const [activeTab, setActiveTab] = useState("sites");

  return (
    <div>
      <p className="is-size-5 has-text-centered">
        Aqui você encontra diversos recursos para auxiliar nos estudos e
        pesquisas em Geofísica.
      </p>
      <div className="tabs is-toggle is-toggle-rounded is-large is-centered">
        <ul>
          <li className={activeTab === "sites" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("sites")}>
              <i className="fa-solid fa-globe"></i> &nbsp; Sites
            </a>
          </li>
          <li className={activeTab === "softwares" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("softwares")}>
              <i className="fa-solid fa-laptop-code"></i> &nbsp; Softwares
            </a>
          </li>
          <li className={activeTab === "databases" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("databases")}>
              <i className="fa-solid fa-database"></i> &nbsp; Databases
            </a>
          </li>
        </ul>
      </div>
      <div className="columns has-text-centered">
        <div className="column"></div>
        <div className="column is-three-quarters">
          <div>
            {activeTab === "sites" && (
              <ul className="is-size-6 has-text-justified px-6 mx-1">
                {siteLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>
                      <b>{link.title}</b>
                    </a>
                    {link.description ? ` - ${link.description}` : ""}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === "softwares" && (
              <ul className="is-size-6 has-text-justified px-6 mx-1">
                {softwareLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>
                      <b>{link.title}</b>
                    </a>
                    {link.description ? ` - ${link.description}` : ""}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === "databases" && (
              <ul className="is-size-6 has-text-justified px-6 mx-1">
                {databaseLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>
                      <b>{link.title}</b>
                    </a>
                    {link.description ? ` - ${link.description}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="column"></div>
      </div>
    </div>
  );
};

export default ResourcesTab;
