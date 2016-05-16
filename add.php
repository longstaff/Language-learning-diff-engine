<?php

    $return = [];

    session_start();

    // Check a POST is valid.
    if (isset($_POST['admin_token']) && $_POST['admin_token'] === $_SESSION['admin_token']) {
        
        $store = file_get_contents('data.json');
        $jsonData = json_decode($store, true);

        if(isset($_POST['id']) && isset($_POST['diffs'])){

            $index = -1;
            for($i = 0; $i < count($jsonData['tranlations']); $i++){
                if($jsonData['tranlations'][$i]['id'] == $_POST['id']){
                    $index = $i;
                    break;
                }
            }

            if($index >= 0){
                $jsonData['tranlations'][$i]['diffs'] = $_POST['diffs'];
                $jsonData['tranlations'][$i]['difftime'] = time();
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
                'id' => uniqid(),
                'createdtime' => time()
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