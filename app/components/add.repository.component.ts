import { Component } from "@angular/core";

@Component({
  selector: "add-repository-panel",
  template: `
    <div class="add-repository-panel" id="add-repository-panel">
      <img src="./assets/Back.svg" (click)="returnToMainPanel()" class="back-button">

      <div class="add-repository-body">
        <div class="title">
          <h1 class="clone-title">Clone from Internet</h1>
        </div>

        <div class="block">
          <div class="left">
            <p>URL to clone from</p>
          </div>
          <div class="right">
          <input type="text" oninput="updateLocalPath()" name="repositoryRemote" size="50" id="repoClone" placeholder="https://github.com/user/repository.git"/>
          </div>
        </div>

        <div class="block">
          <div class="left">
            <p>File location to save to</p>
          </div>
          <div class="right">
            <input type="text" name="repositoryLocal" size="50" id="repoSave"/>
            <button class="button-clone" (click)="selectSave()">Clone</button>
            <input type="file" id="dirPickerSaveNew" name="dirListSave" (change)="addRepository();" style="display: none;" webkitdirectory />
          </div>
        </div>


        <div class="title">
          <h1 class="open-local-repo">Open Local Repository</h1>
        </div>

        <div class="block">
          <div class="left">
            <p>Location of existing repository</p>
          </div>
          <div class="right">
            <input type="text" name="repositoryLocal" size="50" id="repoOpen"/>
            <button class="button-open" (click)="selectDirectory()">Open</button>
            <input type="file" id="dirPickerOpenLocal" name="dirList" (change)="openRepository()" style="display: none;" webkitdirectory />
          </div>
        </div>
      </div>
    </div>
  `
})

export class AddRepositoryComponent {

  addRepository(): void {
    downloadRepository();
    switchToMainPanel();
  }

  selectSave(): void {
    if (document.getElementById("repoSave").value == null || document.getElementById("repoSave").value == "") {
      document.getElementById("dirPickerSaveNew").click();
    }
  }

  selectDirectory(): void {
    if (document.getElementById("repoOpen").value == null || document.getElementById("repoOpen").value == "") {
      document.getElementById("dirPickerOpenLocal").click();
    }
  }

  openRepository(): void {
    openRepository();
    switchToMainPanel();
  }

  returnToMainPanel(): void {
    switchToMainPanel();
  }
}
