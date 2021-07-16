class Dashboard {
  constructor() {
    this.activePage = "";
    this.links = [];
  }

  getContent(page) {
    return new Promise((resolve, reject) => {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            resolve(this.responseText);
          } else {
            reject(new Error("Page not found"));
          }
        }
      };
      xhttp.open("GET", page, true);
      xhttp.send();
    });
  }

  showSwaggerPage(url) {
    this.activePage = url;
    // Begin Swagger UI call region
    const ui = SwaggerUIBundle({
      url: url,
      dom_id: "#mainContent",
      presets: [SwaggerUIBundle.presets.apis],
      plugins: [SwaggerUIBundle.plugins.DownloadUrl],
      layout: "BaseLayout"
    });
    // End Swagger UI call region

    window.ui = ui;
  }

  showActiveLink() {
    for (let item of this.links) {
      let page = item.getAttribute("target");
      if (page === this.activePage) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    }
  }

  async showCustomPage(page) {
    try {
      this.activePage = page;
      let mainContent = document.getElementById("mainContent");
      mainContent.innerHTML = await this.getContent(page);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

(async () => {
  try {
    let dashboard = new Dashboard();

    let customLinks = document.getElementsByClassName("custom-page-link");
    for (let item of customLinks) {
      let page = item.getAttribute("target");
      dashboard.links.push(item);
      item.onclick = function (e) {
        e.preventDefault();
        dashboard.showCustomPage(page);
        dashboard.showActiveLink();
      };
    }

    const menuContent = await dashboard.getContent("./apis/menu.json?v1");
    const menu = JSON.parse(menuContent);
    const sidebarMenuUL = document.getElementById("sidebarMenuUL");

    for (let item of menu.items) {
      let li = document.createElement("li");
      li.classList.add("nav-item");
      let target = `./apis/${item.target}?${item.version}`;
      let a = document.createElement("a");
      a.classList.add("nav-link");
      a.setAttribute("aria-current", "page");
      a.setAttribute("target", target);
      a.setAttribute("href", "#");
      a.onclick = function (e) {
        e.preventDefault();
        dashboard.showSwaggerPage(target);
        dashboard.showActiveLink();
      };
      a.innerHTML = `<span data-feather="home"></span>${item.name}`;
      li.append(a);
      sidebarMenuUL.append(li);
      dashboard.links.push(a);
    }

    // let swaggerLinks = document.getElementsByClassName("swagger-link");
    // for (let item of swaggerLinks) {
    //   let page = item.getAttribute("target");
    //   dashboard.links.push(item);
    //   item.onclick = function (e) {
    //     e.preventDefault();
    //     dashboard.showSwaggerPage(page);
    //     dashboard.showActiveLink();
    //   };
    // }

    dashboard.showCustomPage("welcome.html");
  } catch (e) {
    console.error(e);
  }
})();
