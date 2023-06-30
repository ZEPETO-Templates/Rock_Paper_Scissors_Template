import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { SpawnInfo, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { WorldService } from 'ZEPETO.World';

export default class PlayerSpawner extends ZepetoScriptBehaviour {

    Start () {
        // Grab the user id specified from logging into zepeto through the editor. 
        ZepetoPlayers.instance.CreatePlayerWithUserId( WorldService.userId, new SpawnInfo(), true );
        // ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener( () => {
        // } );
        
    }

}