<?php

    $return = [];

    session_start();

    // Check a POST is valid.
    if (isset($_POST['csrf_token']) && $_POST['csrf_token'] === $_SESSION['csrf_token']) {
        
        $store = file_get_contents('data.json');
        $jsonData = json_decode($store, true);
        $tranlations = $jsonData['tranlations'];

        $complete = false;
        $open = false;
        if(isset($_POST['complete'])){
            $complete = true;
            $tranlations = $jsonData['tranlations'];
            $tranlations = array_filter($tranlations, function($var){
                return isset($var["diffs"]);
            });
            usort($tranlations, function ($a, $b){
                return $a["difftime"] > $b["difftime"];
            });
        }
        else if(isset($_POST['open'])){
            $open = true;
            $tranlations = $jsonData['tranlations'];
            $tranlations = array_filter($tranlations, function($var){
                return !isset($var["diffs"]);
            });
            usort($tranlations, function ($a, $b){
                return $a["createdtime"] > $b["createdtime"];
            });
        }

        if(isset($_POST['id'])){

            $post;
            foreach($jsonData['tranlations'] as $item){
                if($item['id'] == $_POST['id']){
                    $post = $item;
                    break;
                }
            }

            if($post){
                $return['success'] = true;
                $tranlations = $post;
                $return['data'] = $tranlations;
            }
            else{
                $return['success'] = false;
                $return['reason'] = 'invalid ID';
            }
        }
        else{
            $idArr = array();

            
            foreach($jsonData['tranlations'] as $item){

                if($complete && isset($item['diffs'])){
                    array_push($idArr, $item['id']);
                }
                else if($open && !isset($item['diffs'])){
                    array_push($idArr, $item['id']);
                }
                else if(!$complete && !$open){
                    array_push($idArr, $item['id']);
                }
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