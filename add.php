<?php

    $return = [];

    session_start();

    // Check a POST is valid.
    if (isset($_POST['csrf_token']) && $_POST['csrf_token'] === $_SESSION['csrf_token']) {
        
        $store = file_get_contents('data.json');
        $jsonData = json_decode($store, true);

        if(isset($_POST['id']) && isset($_POST['diffs'])){
            if($jsonData['tranlations'][$_POST['id']]){
                $jsonData['tranlations'][$_POST['id']]['diffs'] = $_POST['diffs'];
                $return['success'] = true;
            }
            else{
                $return['success'] = false;
                $return['reason'] = 'invalid ID';
            }
        }
        else if(isset($_POST['string'])){
            $newTranslation = array(
                'string' => $_POST['string'],
                'id' => $jsonData['tranlations'].length
            );
            array_push( $jsonData['tranlations'], $newTranslation);

            $return['success'] = true;
            $return['id'] = $newTranslation['id'];
        }
        else{
            $return['success'] = false;
            $return['reason'] = 'invalid data';
        }

        $jsonData = json_encode($jsonData, JSON_PRETTY_PRINT);
        file_put_contents('data.json', $jsonData);

    }
    else {
        $return['success'] = false;
        $return['reason'] = 'invalid token';
    }

    echo JSON_encode($return);

?>