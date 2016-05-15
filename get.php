<?php

    $return = [];

    session_start();

    // Check a POST is valid.
    if (isset($_POST['csrf_token']) && $_POST['csrf_token'] === $_SESSION['csrf_token']) {
        
        $store = file_get_contents('data.json');
        $jsonData = json_decode($store, true);

        if(isset($_POST['id'])){
            if($jsonData['tranlations'][$_POST['id']]){
                $return['success'] = true;
                $return['data'] = $jsonData['tranlations'][$_POST['id']];
            }
            else{
                $return['success'] = false;
                $return['reason'] = 'invalid ID';
            }
        }
        else{
            $idArr = array();
            foreach($jsonData['tranlations'] as $item){
                array_push($idArr, $item['id']);
            }

            $return['success'] = true;
            $return['data'] = $idArr;
        }

    }
    else {
        $return['success'] = false;
        $return['reason'] = 'invalid token';
    }

    echo JSON_encode($return);

?>